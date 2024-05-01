import "../../scss/main/skeleton.scss";

const SingleSeleton = () => {
  return (
    <div className="skeleton-group">
      <div className="skeleton-groupInfo">
        <div className="skeleton-groupIcon"></div>
        <div className="skeleton-groupTitle"></div>
        <div className="skeleton-groupButton"></div>
      </div>
      <div className="skeleton-tabList">
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
        <div className="skeleton-tab"></div>
      </div>
    </div>
  );
};
const GroupSkeleton = () => {
  return (
    <div className="skeleton-group-wrapper">
      <SingleSeleton />
      <SingleSeleton />
      <SingleSeleton />
    </div>
  );
};

export default GroupSkeleton;
