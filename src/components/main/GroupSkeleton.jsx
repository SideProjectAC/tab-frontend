import "../../scss/main/skeleton.scss";

const SingleSkeleton = () => {
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
      <SingleSkeleton />
      <SingleSkeleton />
      <SingleSkeleton />
    </div>
  );
};

export default GroupSkeleton;
