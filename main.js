// 오늘 날짜 create post date로 초기값으로 만들기
// date 바뀜에 따른 day 변화
// 로컬 스토리지에 저장하기
(function () {
  // * POST 부분
  const date = document.querySelector('#post__date');
  const day = document.querySelector('#post__day');
  const postSaveBtn = document.querySelector('#post__save');
  function resetLocalStorage() {
    localStorage.setItem('posts', JSON.stringify([]));
    posts = [];
    nextPostId = 0;
  }
  resetPostsBtn.addEventListener('click', resetLocalStorage);
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
  // ** 저장하기
  postSaveBtn.addEventListener('click', savePost);
  function savePost(e) {
    e.preventDefault();
    const post = getPostValue();
    resetPost();
  }
  function addPostinPosts(post) {
    const postDate = post.date;
    let left = 0;
    let right = posts.length - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (posts[mid].date < postDate) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    posts.splice(left, 0, post);
  }
  function getPostValue() {
    const elements = document.querySelector('#post__form').elements;
    let post = {
      date: 20211016,
      id: nextPostId++,
      Breakfast: '',
      Dinner: '',
      Drinks: '',
      Lunch: '',
      NightSnack: '',
      Snacks: '',
      b_emoji: null,
      c_icon: 0,
      d_emoji: null,
      l_emoji: null,
      w_icon: 0,
    };
    for (const item of elements) {
      switch (item.type) {
        case 'date':
          post[item.name] = Number(item.value.replace(/-/g, ''));
          break;
        case 'text':
          post[item.name] = item.value;
          break;
        case 'checkbox':
          if (item.name === 'w_icon' || item.name === 'c_icon') {
            if (item.checked === true) {
              post[item.name] = post[item.name] + 1;
            }
          } else {
            if (item.checked === true) {
              post[item.name] = item.value;
            }
          }
          break;
        default:
          break;
      }
    }
  }
  function resetPost() {
    const Postform = document.querySelector('#post__form');
    Postform.reset();
    setTodayDate();
  }
  // * 초기설정
  function setTodayDate() {
    const today = new Date();
    const todayDate =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const todayDay = new Date(today).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    date.value = todayDate;
    day.innerHTML = todayDay;
  }

  function start() {
    setTodayDate();
  }

  window.addEventListener('load', start);
})();
