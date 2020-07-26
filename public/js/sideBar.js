const changeSvgColour = function(id) {
  document.querySelector(`#${id}`).classList.add('change-svg-colour');
};

const restoreSvgColour = function(id) {
  document.querySelector(`#${id}`).classList.remove('change-svg-colour');
};
