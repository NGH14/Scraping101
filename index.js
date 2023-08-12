import puppeteer from 'puppeteer-core';
import fs from 'fs';

const getQuotes = async () => {
	// Start a Puppeteer session with:
	// - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
	// - no default viewport (`defaultViewport: null` - website page will in full width and height)
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		executablePath:
			'C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe',
	});

	// Open a new page
	const page = await browser.newPage();

	await page.goto('http://quotes.toscrape.com/', {
		waitUntil: 'domcontentloaded',
	});

	// Get page data
	const quotes = await page.evaluate(() => {
		// Fetch the first element with class "quote"
		const quotes = document.querySelectorAll('.quote');

		// Fetch the sub-elements from the previously fetched quote element
		// Get the displayed text and return it (`.innerText`)
		return Array.from(quotes).map((quote, index) => {
			const text = quote.querySelector('.text').innerText;
			const author = quote.querySelector('.author').innerText;

			return { text, author };
		});
	});

	// Display the quotes
	fs.writeFile('quotes.txt', JSON.stringify(quotes), function (err) {
		if (err) throw err;
		console.log('Saved!');
	}); // Close the browser
	await browser.close();
};

getQuotes();
