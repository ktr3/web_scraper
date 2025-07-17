import puppeteer, { Browser, Page } from 'puppeteer';
import { Task, ScrapingResult } from '../types';
import { pool } from '../utils/database';

class ScraperService {
  private browser: Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080'
        ]
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async updateTaskStatus(taskId: string, status: Task['status'], result?: ScrapingResult[], errorMessage?: string) {
    const updateData: any = {
      status,
      updated_at: new Date(),
    };

    if (result) {
      updateData.result = JSON.stringify(result);
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `UPDATE tasks SET ${setClause} WHERE id = $1`;
    const values = [taskId, ...Object.values(updateData)];

    await pool.query(query, values);
  }

  async scrapeUrl(url: string, selectors: { title: string; content: string }): Promise<ScrapingResult[]> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const results = await page.evaluate((sel) => {
        const titleElements = document.querySelectorAll(sel.title);
        const contentElements = document.querySelectorAll(sel.content);
        
        const data: ScrapingResult[] = [];
        const maxLength = Math.max(titleElements.length, contentElements.length);

        for (let i = 0; i < maxLength; i++) {
          const titleEl = titleElements[i];
          const contentEl = contentElements[i];
          
          const title = titleEl?.textContent?.trim() || '';
          const content = contentEl?.textContent?.trim() || '';
          
          if (title || content) {
            data.push({
              title,
              content,
              url: window.location.href
            });
          }
        }

        return data;
      }, selectors);

      return results;
    } finally {
      await page.close();
    }
  }

  async scrapeWithPagination(
    url: string, 
    selectors: { title: string; content: string },
    paginationSelector: string,
    maxPages: number = 10
  ): Promise<ScrapingResult[]> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    const allResults: ScrapingResult[] = [];

    try {
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      let currentPage = 1;

      while (currentPage <= maxPages) {
        // Scrape current page
        const pageResults = await page.evaluate((sel) => {
          const titleElements = document.querySelectorAll(sel.title);
          const contentElements = document.querySelectorAll(sel.content);
          
          const data: ScrapingResult[] = [];
          const maxLength = Math.max(titleElements.length, contentElements.length);

          for (let i = 0; i < maxLength; i++) {
            const titleEl = titleElements[i];
            const contentEl = contentElements[i];
            
            const title = titleEl?.textContent?.trim() || '';
            const content = contentEl?.textContent?.trim() || '';
            
            if (title || content) {
              data.push({
                title,
                content,
                url: window.location.href
              });
            }
          }

          return data;
        }, selectors);

        allResults.push(...pageResults);

        // Try to find and click next button
        const nextButton = await page.$(paginationSelector);
        if (!nextButton) {
          break;
        }

        const isDisabled = await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return element?.hasAttribute('disabled') || 
                 element?.classList.contains('disabled') ||
                 element?.getAttribute('aria-disabled') === 'true';
        }, paginationSelector);

        if (isDisabled) {
          break;
        }

        try {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
            nextButton.click()
          ]);
        } catch (error) {
          // Navigation might not occur, try to wait for content change
          await page.waitForTimeout(2000);
        }

        currentPage++;
      }

      return allResults;
    } finally {
      await page.close();
    }
  }

  async executeTask(task: Task) {
    try {
      await this.updateTaskStatus(task.id, 'in_progress');

      let results: ScrapingResult[];

      if (task.pagination.enabled && task.pagination.next_button_selector) {
        results = await this.scrapeWithPagination(
          task.url,
          task.selectors,
          task.pagination.next_button_selector
        );
      } else {
        results = await this.scrapeUrl(task.url, task.selectors);
      }

      await this.updateTaskStatus(task.id, 'completed', results);
      
      console.log(`Task ${task.id} completed successfully with ${results.length} results`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      await this.updateTaskStatus(task.id, 'failed', undefined, errorMessage);
      
      console.error(`Task ${task.id} failed:`, errorMessage);
    }
  }
}

export const scraperService = new ScraperService();