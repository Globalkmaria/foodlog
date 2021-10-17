  // ** input emoji 한개만 클릭
  const inputEmojis = document.querySelectorAll('.item__emoji');
  for (const inputEmoji of inputEmojis) {
    inputEmoji.addEventListener('click', (e) => {
      let currentEmoji = e.target;
      if (e.target.tagName === 'IMG') {
        currentEmoji = e.target.previousElementSibling;
      }
      const currentEmojiId = currentEmoji.id;
      const emojis = document.querySelectorAll(
        `input[name=${currentEmoji.name}]`
      );
      for (const emoji of emojis) {
        if (emoji.id !== currentEmojiId && emoji.checked) {
          emoji.checked = false;
        }
      }
    });
  }
