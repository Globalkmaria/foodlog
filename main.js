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
  // ** 날짜변경
  date.addEventListener('change', changeDay);
  function changeDay() {
    const dateValue = date.value;
    // ex) dateValue = 2021-10-21
    const newDate = new Date(dateValue);
    const newday = newDate.toLocaleDateString('en-US', { weekday: 'long' });
    day.innerHTML = newday.slice(0, 3);
  }
