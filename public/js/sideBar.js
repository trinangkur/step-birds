const changeSvgColour = function(id) {
  document.querySelector(`#${id}`).classList.add('change-svg-colour');
};

const restoreSvgColour = function(id) {
  document.querySelector(`#${id}`).classList.remove('change-svg-colour');
};

const assignHome = function() {
  location.assign('/user/home');
};

const assignProfile = function() {
  handleRedirectedRequest('/user/showProfile');
};

const showTweetPopUp = function() {
  document.getElementById('tweetPopUp').style.display = 'block';
};

const changeColour = function(countIndicatorId, strokeSize, colour) {
  const startingStrokeSize = 56;
  const circleElement = document.querySelector(`#${countIndicatorId}`);

  circleElement.style.strokeDashoffset = startingStrokeSize - strokeSize;
  circleElement.style.stroke = colour;
};

const maxLength = 180;

const indicateCountByColour = function(countIndicatorId, charCount) {
  const startingSize = 56;

  if (charCount > maxLength) {
    const strokeSize = (charCount - maxLength) * (startingSize / maxLength);
    changeColour(countIndicatorId, strokeSize, 'rgb(198, 23, 23)');
    return;
  }
  const strokeSize = charCount * (startingSize / maxLength);
  changeColour(countIndicatorId, strokeSize, '#4a61c8');
};

const toggleClickEvent = function(tweetElementId, charCount) {
  const buttonElement = document.querySelector(`#${tweetElementId}`).firstChild;

  if (charCount > maxLength) {
    buttonElement.classList.add('remove-access');
    buttonElement.classList.remove('add-access');
    return;
  }
  buttonElement.classList.add('add-access');
  buttonElement.classList.remove('remove-access');
};

const showCharCount = (textBoxId, countIndicatorId, counterId, tweetId) => {
  const charCount = document.querySelector(`#${textBoxId}`).value.length;

  indicateCountByColour(countIndicatorId, charCount);
  toggleClickEvent(tweetId, charCount);
  const numberElement = document.querySelector(`#${counterId}`);
  numberElement.innerHTML = maxLength - charCount;
};

const closeTweetPopUp = function() {
  document.getElementById('tweetPopUp').style.display = 'none';
};
