# tabColab - frontend

## how to start

1. make sure backend server is opened [http://localhost:5050/api-doc](http://localhost:5050/api-doc)
2. ```npm install i```
3. ```npm run build``` 
   
4. Open Chrome Extensions Page:

   Type **chrome://extensions/** into the Chrome address bar and press Enter. This opens the Extensions page where you can manage installed extensions and load new ones.
   
5. Enable Developer Mode:

   On the top-right corner of the Extensions page, you’ll find a toggle switch for “**Developer mode**.” Make sure it’s turned on. This allows you to load unpacked extensions and see additional developer options.

6. Load Your Unpacked Extension:

   Click on the “**Load unpacked**” button, which appears in the top-left area after enabling Developer mode.
   Navigate to the directory where your extension is located, and select **dist** folder. 

7. Open a New Tab:

   With the extension loaded, simply open a new tab in Chrome. Instead of the default New Tab page, you should now see the index.html page defined in your extension.
     
     ** if you don't want to change your setting with chrome, you can also go to the site below:
     
    first check your extension ID , then replace it with: [chrome-extension://your-EXTENSION-ID/index.html](chrome-extension://your-EXTENSION-ID/index.html)



