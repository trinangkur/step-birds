const searchOnEnter = function(name) {
  if (event.keyCode === 13) {
    sendPOSTRequest('/user/searchProfile', { name }, showSearchUserProfile);
  }
};

const createProfileTemplate = function({ id, name, image_url }) {
  return `<div class="profileLink" onclick="getUserProfile('${id}')">
            <img src="${image_url}"/>
            <h3>${name}</h3><p>@${id}</p></div>`;
};

const showSearchUserProfile = function(profiles) {
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = profiles.reduce((html, profileInfo) => {
    const profileTemplate = createProfileTemplate(profileInfo);
    return html + profileTemplate;
  }, '');
};

const getUserProfile = function(id) {
  location.assign(`/user/profile/${id}`);
};

