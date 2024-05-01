import { useRef, useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useGroups } from "../useContext/GroupContext";
import { ThemeContext } from "../useContext/ThemeContext";
import Group from "./Group";
import { deleteGroupAPI } from "../../api/groupAPI";
import { groupsPropTypes } from "./PropTypes";

Groups.propTypes = groupsPropTypes;

function Groups({ handleDrop, handleDragOver, handleDragStart }) {
  const { groups, setGroups, isLoading } = useGroups();
  const theme = useContext(ThemeContext);

  const baseColor = theme.theme === "light" ? "#ebebeb" : "#373737";
  const highlightColor = theme.theme === "light" ? "#f5f5f5" : "#5f5f5f";

  const newGroupId = useRef(null);

  async function handleDeleteGroup(groupId) {
    try {
      await deleteGroupAPI(groupId);
      // console.log("Group deleted successfully");

      setGroups((prev) => prev.filter((group) => group.group_id !== groupId));
    } catch (error) {
      console.error("Error deleting group", error);
    }
  }

  const handleSiteCount = (groupId) => {
    const group = groups.find((g) => g.group_id === groupId);
    if (group) {
      group.items.forEach((item) => {
        chrome.tabs.create({ url: item.browserTab_url, active: false });
      });
    } else {
      console.error("Group not found:", groupId);
    }
  };

  return (
    <>
      <div className="groups">
        {isLoading ? (
          <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <div className="skeleton-wrapper">
              <Skeleton className="group-skeleton" />
              <Skeleton className="group-skeleton" />
              <Skeleton className="group-skeleton" />
            </div>
          </SkeletonTheme>
        ) : (
          <div className="groupList">
            {groups.map((group) => (
              <Group
                key={group.group_id}
                group={group}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                handleSiteCount={handleSiteCount}
                handleDeleteGroup={handleDeleteGroup}
                handleDragOver={handleDragOver}
              />
            ))}
          </div>
        )}
        <div
          className="newGroup"
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(e, newGroupId);
          }}
        ></div>
      </div>
    </>
  );
}

export default Groups;
