import styles from './manageStories.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

export default function ManageStories({ 
  pendingStories = [], 
  approvedStories = [], 
  onApprove, 
  onReject, 
  onDelete 
}) {
  const navigate = useNavigate();
  const storyContentRefs = useRef({});
  const [overflowedStories, setOverflowedStories] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const overflowCheck = {};
    Object.entries(storyContentRefs.current).forEach(([id, el]) => {
      if (el) {
        overflowCheck[id] = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      }
    });
    setOverflowedStories(overflowCheck);
  }, [pendingStories, approvedStories]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const handleLogout = () => {
    navigate('/');
  };

  const scrollStoryContent = (id, direction) => {
    const el = storyContentRefs.current[id];
    if (!el) return;

    const scrollStep = 100;
    switch(direction) {
      case 'up':
        el.scrollBy({ top: -scrollStep, behavior: 'smooth' });
        break;
      case 'down':
        el.scrollBy({ top: scrollStep, behavior: 'smooth' });
        break;
      case 'left':
        el.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        break;
      case 'right':
        el.scrollBy({ left: scrollStep, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  const handleModalClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const ScrollButtons = ({ id }) => (
    <div className={styles.scrollButtonsContainer}>
      <button aria-label="Scroll up" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'up')}>▲</button>
      <button aria-label="Scroll down" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'down')}>▼</button>
      <button aria-label="Scroll left" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'left')}>◀</button>
      <button aria-label="Scroll right" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'right')}>▶</button>
    </div>
  );

  return (
    <div className={styles.manageStoriesBackground}>

      {/* Modal Overlay */}
      {modalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={handleModalClick} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modalTitle"
          tabIndex={-1}
        >
          <div className={styles.modalContent}>
            <h3 id="modalTitle" className={styles.modalTitle}>{modalTitle}</h3>
            <div className={styles.modalBody}>
              {modalContent}
            </div>
            <button className={styles.modalCloseButton} onClick={closeModal} aria-label="Close modal">×</button>
          </div>
        </div>
      )}

      <nav className={styles.navStories}>
        <ul>
          <li>
            <NavLink 
              to="/manageStories"
              className={({ isActive }) => isActive ? styles.active : undefined}
            >
              Manage Stories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manageSafetyMap"
              className={({ isActive }) => isActive ? styles.active : undefined}
            >
              Manage Safety Map
            </NavLink>
          </li>
        </ul>
      </nav>

      <button 
        className={styles.logoutButton} 
        onClick={handleLogout}
      >
        Log Out
      </button>

      <div className={styles.contentContainer}>

        {/* Pending Stories Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Pending Stories ({pendingStories.length})
          </h2>
          <div className={styles.storiesGrid}>
            {pendingStories.length === 0 ? (
              <p className={styles.emptyMessage}>No pending stories</p>
            ) : (
              pendingStories.map(story => (
                <div key={story.id} className={styles.storyCard}>
                  <div className={styles.storyHeader}>
                    <span className={styles.statusBadge}>Pending</span>
                  </div>
                  <div 
                    className={styles.storyContentScrollable} 
                    ref={el => storyContentRefs.current[story.id] = el}
                    tabIndex={0} 
                    aria-label="Story content scroll area"
                  >
                    <p className={styles.storyText}>
                      {story.text.length > 200 ? story.text.substring(0, 200) + '...' : story.text}
                    </p>
                  </div>
                  <small className={styles.submissionDate}>
                    Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                  </small>
                  {story.text.length > 200 && (
                    <>
                      <br />
                      <button 
                        className={styles.fullStory} 
                        onClick={() => openModal('ACCOUNT STATUS', (
                          <div>
                            <h4>Account Activity Report</h4>
                            <h4>Username: </h4>
                            <h4><br/>Story Description:</h4>
                            
                            <div className={styles.storyBox}>
                              <p>{story.text}</p>
                            </div>
                            <div className={styles.fullStoryExtra}>
                              <p>Date Created: {new Date(story.submittedAt).toLocaleDateString()}</p>
                              {/* <p><strong>Story ID:</strong> {story.id}</p> */}
                            </div>
                            <button className={styles.printReportButton}>Print Report</button>
                          </div>
                        ))}
                      >
                        See More
                      </button>
                    </>
                  )}
                  {overflowedStories[story.id] && <ScrollButtons id={story.id} />}
                  
                  <div className={styles.actionButtons}>
                    <button className={styles.approveButton} onClick={() => onApprove(story.id)}>Approve</button>
                    <button className={styles.rejectButton} onClick={() => onReject(story.id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Approved Stories Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Approved Stories ({approvedStories.length})
          </h2>
          <div className={styles.storiesGrid}>
            {approvedStories.length === 0 ? (
              <p className={styles.emptyMessage}>No approved stories</p>
            ) : (
              approvedStories.map((story, idx) => (
                <div key={idx} className={styles.storyCard}>
                  <div className={styles.storyHeader}>
                    <span className={`${styles.statusBadge} ${styles.approved}`}>Approved</span>
                  </div>
                  <div
                    className={styles.storyContentScrollable}
                    ref={el => storyContentRefs.current[`approved-${idx}`] = el}
                    tabIndex={0}
                    aria-label="Story content scroll area"
                  >
                    <p className={styles.storyText}>
                      {story.length > 200 ? story.substring(0, 200) + '...' : story}
                    </p>
                  </div>
                  {story.length > 200 && (
                    <>
                      <br />
                      <button 
                        className={styles.fullStory} 
                        onClick={() => openModal('Approved Story', (
                          <div>
                            <p>{story}</p>
                            <hr />
                            <div>
                              <h4>Story Status</h4>
                              <p><strong>Status:</strong> Approved</p>
                              <p><strong>Action:</strong> Currently live on the platform</p>
                              {/* Add more details or text here if needed */}
                            </div>
                          </div>
                        ))}
                      >
                        See More
                      </button>
                    </>
                  )}
                  {overflowedStories[`approved-${idx}`] && <ScrollButtons id={`approved-${idx}`} />}
                  <div className={styles.actionButtons}>
                    <button className={styles.deleteButton} onClick={() => onDelete(story)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};