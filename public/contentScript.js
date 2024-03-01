// // to append the popup
// const appRoot = document.createElement('div');
// appRoot.id = 'popup-app';
// document.body.appendChild(appRoot);


//emoji API
// import axios from 'axios';
// const emoji_all = 'https://emoji-api.com/emojis?access_key=fa981b410a078f14f3922425982f0551af30a5c7'; 

// export const fetchEmoji = async () => {
//   try {
//     const response = await axios.get(emoji_all); 
//     return response.data;
//   } catch (error) {
//     console.error('error in fetching Emoji: ', error);
//     throw error;
//   }
// };

//在要執行的file:
// const getRandomEmoji = async () => {
//         try {
//             const apiEmoji = await fetchEmoji();
//             const randomIndex = Math.floor(Math.random() * apiEmoji.length);
//             const emojiCodeHex = apiEmoji[randomIndex].codePoint;
//             const emojiCode = parseInt(emojiCodeHex, 16)
//             return  String.fromCodePoint(emojiCode)
//         } catch (error) {
//             console.error('emoji Error', error);
//             throw error; 
//         }
//     };