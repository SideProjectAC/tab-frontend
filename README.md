# TabColab - frontend

**Chrome Extension for Enhanced Tab Management**.
A powerful Chrome extension designed to revolutionize the way you manage your browser tabs. With TabColab, you can effortlessly group tabs by dragging, add detailed notes, and manage your todos directly from your browser. This tool is ideal for professionals, students, researchers, and anyone looking to boost their productivity and organize their browsing experience.

## Features

**1. Tab Grouping**

- Drag to Group: Easily group your tabs by dragging them together. This visual approach helps you organize tabs into categories or projects, enhancing your workflow and focus.
- Manage Groups: Rename, chose group Icon, or dissolve groups as your project needs evolve.

**2. Notes and Todos**

- Add Notes: add a new note or todo at the end of your desired group, to keep track of important information or quick reminders.
- Manage Todos: Create, check off, and delete todos related to specific tabs or projects. Keep your task list integrated with your browsing.

**3. Popup Interface**

- Quick Access: Use the popup to quickly add new tabs and new notes to existing groups, adding a note without leaving your current context.
- Seamless Integration: The popup interface integrates smoothly with your browsing, providing a natural and intuitive tool for managing your tabs, notes.

**4. Search Functionality**

- Search Tab: Quickly locate any open tab with a powerful search feature that filters tabs by their title or URL, making it easier to manage large numbers of tabs.

**5. Theme customization**

- Dark and Light Modes: Toggle between dark and light themes to customize the appearance of your extension interface according to your preference or ambient lighting conditions.

**6. Google OAuth Sign-In**

- Personalized Experience: Sign in with your Google account to synchronize your tab groups, notes, and todos across all your devices. This ensures a seamless experience no matter where you access your browser.

## How to start (Developer Installation Guide)

1. `npm install i`
2. `npm run build`
3. Open Chrome Extensions Page:

   Type **chrome://extensions/** into the Chrome address bar and press Enter. This opens the Extensions page where you can manage installed extensions and load new ones.

4. Enable Developer Mode:

   On the top-right corner of the Extensions page, you’ll find a toggle switch for “**Developer mode**.” Make sure it’s turned on. This allows you to load unpacked extensions and see additional developer options.

5. Load Your Unpacked Extension:

   Click on the “**Load unpacked**” button, which appears in the top-left area after enabling Developer mode.
   Navigate to the directory where your extension is located, and select **dist** folder.

6. Open a New Tab:

   With the extension loaded, simply open a new tab in Chrome. Instead of the default New Tab page, you should now see the index.html page defined in your extension.
