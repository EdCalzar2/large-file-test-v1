import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './components/pages/Login.css';
import Login from './components/pages/Login';
import MainPage from './MainPage';
import { Story, Safety_map } from './components/pages';
import ManageStories from './components/pages/ManageStories';
import SignUp from './components/pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';  
import ForgotPassword from './components/pages/ForgotPassword';

function App() {
  const [stories, setStories] = useState([]); // Approved stories
  const [pendingStories, setPendingStories] = useState([]); // Pending stories

  const addPendingStory = (newStoryText) => {
    const storyWithId = {
      id: Date.now(),
      text: newStoryText,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setPendingStories(prev => [...prev, storyWithId]);
  };

  const approveStory = (storyId) => {
    const storyToApprove = pendingStories.find(story => story.id === storyId);
    if (storyToApprove) {
      setStories(prev => [...prev, storyToApprove]);  // store whole object
      setPendingStories(prev => prev.filter(story => story.id !== storyId));
    }
  };

  const rejectStory = (storyId) => {
    setPendingStories(prev => prev.filter(story => story.id !== storyId));
  };

  const deleteApprovedStory = (storyId) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route 
        path="/story" 
        element={
          <ProtectedRoute>
            <MainPage>
              <Story 
                stories={stories} 
                setStories={setStories} 
                onAddStory={addPendingStory} 
              />
            </MainPage>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/safety_map" 
        element={
          <ProtectedRoute>
            <MainPage>
              <Safety_map />
            </MainPage>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/manageStories" 
        element={
          <ProtectedRoute>
            <ManageStories 
              pendingStories={pendingStories}
              approvedStories={stories}
              onApprove={approveStory}
              onReject={rejectStory}
              onDelete={deleteApprovedStory}
            />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/signUp" 
        element={<SignUp onSubmitStory={addPendingStory} />} 
      />

      {/* Forgot password route must be inside Routes */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
