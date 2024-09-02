import React from "react";
import "./testing.css";
const ProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">G</div>
        <h1 className="profile-name">Ganpat.6120</h1>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <p>0</p>
          <p>Reviews</p>
        </div>
        <div className="stat-item">
          <p>0</p>
          <p>Photos</p>
        </div>
        <div className="stat-item">
          <p>0</p>
          <p>Followers</p>
        </div>
      </div>
      <div className="main-container">
        <div className="activity-menu">
          <div className="menu-item">Reviews</div>
          <div className="menu-item">Photos</div>
          <div className="menu-item">Followers</div>
          <div className="menu-item">Recently Viewed</div>
          <div className="menu-item">Bookmarks</div>
          <div className="menu-item">Blog Posts</div>
        </div>
        <div className="content-container">
          <div className="empty-content">
            <div className="empty-content-icon">📝</div>
            <p>Nothing here yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
