import PropTypes from 'prop-types';

//shared propTypes
const itemPropTypes = {
  browserTab_url: PropTypes.string,
  windowId: PropTypes.number,
  item_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  browserTab_title: PropTypes.string,
};


const dragDropPropTypes = {
  handleDrop: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDragOver: PropTypes.func,
};

//individual propTypes
export const tabItemPropTypes = {
  tab: PropTypes.shape(itemPropTypes),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const groupPropTypes = {
  group: PropTypes.shape({
    group_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    group_icon: PropTypes.string,
    group_title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)),
  }),
};

export const groupsPropTypes = {
  dragDropPropTypes
};


export const activeTabsPropTypes = {
  activeTabs: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)),
  dragDropPropTypes
};

export const emojiPropTypes = {
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setShowEmojiGroupId: PropTypes.func,
};

//popup propTypes
export const popupContentPropTypes = {
  currentTab: PropTypes.shape(itemPropTypes),
};