// 로컬 스토리지에 저장하기
// 불러와서 정렬하는것을 고려해봐야함, 저장할때는 그냥 이어 붙이기?
(function () {
  const date = document.querySelector('#post__date');
  const day = document.querySelector('#post__day');
  const postSaveBtn = document.querySelector('#post__save');
  const postResetBtn = document.querySelector('#post__clear');
  const resetPostsBtn = document.querySelector('#reset-posts');
  const postsDiv = document.querySelector('.posts');
  const inputEmojis = document.querySelectorAll('.item__emoji');

  let posts = [];
  let nextPostId = 0;

  // * LocalStorage
  function getSavedPosts() {
    posts = JSON.parse(localStorage.getItem('posts')) || [];
    nextPostId = posts.length;
  }
  function saveInLocalStorage(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
  }
  function resetLocalStorage() {
    localStorage.setItem('posts', JSON.stringify([]));
    posts = [];
    nextPostId = 0;
    resetPost();
    postsDiv.innerHTML = '';
  }
  // ** LocalStorage 전체 초기화
  resetPostsBtn.addEventListener('click', resetLocalStorage);

  // * POST 부분
  // ** Post date 선택에 따른 day 변화
  date.addEventListener('change', () => {
    const dateValue = date.value;
    day.innerHTML = changeDay(dateValue);
  });

  // ** input emoji 한개만 클릭
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
  // ** Post SAVE
  function searchPostAddIndex(postDate) {
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
    return left;
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

    return post;
  }

  function savePost(e) {
    e.preventDefault();
    const post = getPostValue();
    if (posts.find((p) => p.date === post.date)) {
      nextPostId--;
      alert('You have a log for this date!');
      return;
    }
    // 날짜 순서에 맞게 추가하기 내림차순, 이분탐색
    const addIndexPoint = searchPostAddIndex(post.date);
    posts.splice(addIndexPoint, 0, post);
    saveInLocalStorage(posts);
    const newPost = makePostedPost(post);
    if (posts.length === 1 || post.date === posts[posts.length - 1].date) {
      postsDiv.append(newPost);
    } else {
      const nextPost = postsDiv.children[addIndexPoint];
      postsDiv.insertBefore(newPost, nextPost);
    }
    resetPost();
  }
  postSaveBtn.addEventListener('click', savePost);

  // ** Post RESET
  function resetPost() {
    const Postform = document.querySelector('#post__form');
    Postform.reset();
    setTodayDate();
  }
  postResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetPost();
  });

  // * Posts
  function makePostedPost(post) {
    const {
      id,
      date,
      Breakfast,
      b_emoji,
      Lunch,
      l_emoji,
      Dinner,
      d_emoji,
      NightSnack,
      Drinks,
      Snacks,
      w_icon,
      c_icon,
    } = post;
    const postedDate = makePostedDate(date);

    const postedPost = document.createElement('div');
    postedPost.setAttribute('id', id);
    postedPost.setAttribute('class', 'posted-post');

    const postedDelete = document.createElement('button');
    postedDelete.setAttribute('class', 'posted__delete');
    postedDelete.innerHTML = '<i class="fas fa-trash"></i>';
    postedDelete.addEventListener('click', removePost);
    function removePost() {
      postedPost.remove();
      posts = posts.filter((p) => p.id != id);
      saveInLocalStorage(posts);
    }
    postedPost.append(postedDelete);

    const postedTitle = document.createElement('div');
    postedTitle.setAttribute('class', 'posted__title');
    postedTitle.innerHTML = `
    <span class="posted__date">${postedDate}</span>
    <span class="posted__day">${changeDay(postedDate)}</span>`;
    postedPost.append(postedTitle);

    const pitems = document.createElement('div');
    pitems.setAttribute('class', 'pitems');

    const itemWithEmoji = [
      ['Breakfast', b_emoji, Breakfast],
      ['Lunch', l_emoji, Lunch],
      ['Dinner', d_emoji, Dinner],
    ];
    itemWithEmoji.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `pitem ${item[0].toLowerCase()}`;
      itemDiv.innerHTML = makePitemInner1(item[0], item[1], item[2]);
      pitems.append(itemDiv);
    });

    const itemWithOutEmoji = [
      ['Late-night snack', NightSnack],
      ['Snacks', Snacks],
      ['drinks', Drinks],
    ];
    itemWithOutEmoji.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `pitem ${item[0].split(' ')[0].toLowerCase()}`;
      itemDiv.innerHTML = makePitemInner2(item[0], item[1]);
      pitems.append(itemDiv);
    });

    const icons = [
      ['water', 'fa-glass-whiskey', w_icon],
      ['coffee', 'fa-mug-hot', c_icon],
    ];
    icons.forEach((icon) => {
      const iconDiv = document.createElement('div');
      iconDiv.className = `pitem pitem__icons ${icon[0]}`;
      let inner = '';
      for (let i = 0; i < 4; i++) {
        if (i < icon[2]) {
          inner += `<i class="fas ${icon[1]} icon-checked"></i>`;
        } else {
          inner += `<i class="fas ${icon[1]}"></i>`;
        }
      }
      iconDiv.innerHTML = inner;
      pitems.append(iconDiv);
    });
    postedPost.append(pitems);
    return postedPost;
  }

  function makePitemInner1(tite, emoji, text) {
    return makePitemTitle1(tite, emoji) + makePitemText(text);
  }
  function makePitemInner2(tite, text) {
    return (
      `<div class="pitem__title"><h4>${tite}</h4></div>` + makePitemText(text)
    );
  }
  function makePitemTitle1(tite, emoji) {
    return `<div class="pitem__title"><h4>${tite}</h4>
            <div class="pitem__emoji">
              <img class='${
                emoji === 'love' ? 'checked__emoji' : ''
              }' src="./src/love.png" alt="love emoji">
              <img class='${
                emoji === 'smile' ? 'checked__emoji' : ''
              }' src="./src/smile.png" alt="smile emoji">
              <img class='${
                emoji === 'depressed' ? 'checked__emoji' : ''
              }' src="./src/depressed.png" alt="depressed emoji">
              </div></div>`;
  }
  function makePitemText(text) {
    return `<div class="pitem__text">
              <span class="pitem__inner">${text}</span>
            </div>`;
  }
  function makePostedDate(date) {
    date = String(date);
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6);
    return `${year}-${month}-${day}`;
  }

  // * Date/Day
  function changeDay(date) {
    // ex) dateValue = 2021-10-21
    const newDate = new Date(date);
    const newday = newDate.toLocaleDateString('en-US', { weekday: 'long' });
    return newday.slice(0, 3);
  }

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
    day.innerHTML = todayDay.slice(0, 3);
  }

  // * Initial Settig
  function postPosts() {
    posts.forEach((post) => {
      const newPost = makePostedPost(post);
      postsDiv.append(newPost);
    });
  }

  function start() {
    setTodayDate();
    getSavedPosts();
    postPosts();
  }

  window.addEventListener('load', start);
})();
