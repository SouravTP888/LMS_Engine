function calculateTrackStatus(track, progress) {
  if (!track) return null;
  
  const rawTrack = track.toObject ? track.toObject() : JSON.parse(JSON.stringify(track));
  const completedLessons = progress ? progress.completedLessons || [] : [];
  
  rawTrack.modules = rawTrack.modules.sort((a, b) => a.order - b.order);
  
  let previousCompleted = true;
  let totalLessonsInTrack = 0;
  let totalCompletedInTrack = 0;
  
  rawTrack.modules = rawTrack.modules.map((module) => {
    const lessons = module.lessons || [];
    const totalLessons = lessons.length;
    totalLessonsInTrack += totalLessons;
    
    if (totalLessons === 0) {
      const status = previousCompleted ? 'UNLOCKED' : 'LOCKED';
      previousCompleted = false;
      return {
        ...module,
        status,
        completionPercentage: 0
      };
    }
    
    const completedCount = lessons.filter(lesson => 
      completedLessons.includes(lesson._id.toString())
    ).length;
    
    totalCompletedInTrack += completedCount;
    
    const completionPercentage = Math.round((completedCount / totalLessons) * 100);
    const isCompleted = completionPercentage === 100;
    
    let status = 'LOCKED';
    if (isCompleted) {
      status = 'COMPLETED';
    } else if (previousCompleted) {
      status = 'UNLOCKED';
    }
    
    previousCompleted = isCompleted;
    
    return {
      ...module,
      status,
      completionPercentage
    };
  });
  
  rawTrack.totalLessons = totalLessonsInTrack;
  rawTrack.completedLessonsCount = totalCompletedInTrack;
  rawTrack.overallPercentage = totalLessonsInTrack > 0 
    ? Math.round((totalCompletedInTrack / totalLessonsInTrack) * 100) 
    : 0;
    
  return rawTrack;
}

function recommendTrack(careerGoal, skillLevel, tracks) {
  if (!tracks || tracks.length === 0) return null;
  
  let targetTitle = "";
  
  if (careerGoal === "Full Stack Developer") {
    targetTitle = "Full Stack Developer";
  } else if (careerGoal === "AI Engineer") {
    targetTitle = "AI Engineer";
  } else if (careerGoal === "Data Analyst") {
    targetTitle = "Data Analyst";
  } else {
    return tracks[0];
  }
  
  const matched = tracks.find(track => 
    track.title.toLowerCase().includes(targetTitle.toLowerCase())
  );
  
  return matched || tracks[0];
}

function updateStreak(user) {
  const now = new Date();
  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  
  if (!lastActive) {
    user.streak = 1;
    user.lastActiveDate = now;
    return;
  }
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const lastActiveDateOnly = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  
  if (lastActiveDateOnly.getTime() === today.getTime()) {
    // Active today
  } else if (lastActiveDateOnly.getTime() === yesterday.getTime()) {
    user.streak += 1;
  } else {
    user.streak = 1;
  }
  
  user.lastActiveDate = now;
}

function checkAndAwardBadges(user, progress, track) {
  const currentBadges = user.badges || [];
  const newBadges = [...currentBadges];
  
  if (progress && progress.completedLessons.length >= 1 && !newBadges.includes("First Step")) {
    newBadges.push("First Step");
  }
  
  if (user.streak >= 3 && !newBadges.includes("Fast Learner")) {
    newBadges.push("Fast Learner");
  }
  
  if (user.streak >= 7 && !newBadges.includes("Super Streak")) {
    newBadges.push("Super Streak");
  }
  
  if (track && track.overallPercentage === 100 && !newBadges.includes("Track Conqueror")) {
    newBadges.push("Track Conqueror");
  }
  
  if (user.xp >= 500 && !newBadges.includes("Explorer")) {
    newBadges.push("Explorer");
  }
  
  user.badges = newBadges;
  return newBadges;
}

module.exports = {
  calculateTrackStatus,
  recommendTrack,
  updateStreak,
  checkAndAwardBadges
};
