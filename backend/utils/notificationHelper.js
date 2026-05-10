const { createNotification } = require('../controllers/notificationController');

const STATUS_NOTIFICATION_MAP = {
  'Under Review': {
    type: 'application_update',
    title: 'Your application is under review',
    message: 'A recruiter is reviewing your application. Stay tuned!',
  },
  'Shortlisted': {
    type: 'shortlisted',
    title: '🎉 You\'ve been shortlisted!',
    message: 'Congratulations! You have been shortlisted for the next round.',
  },
  'Rejected': {
    type: 'application_update',
    title: 'Application update',
    message: 'Your application was not selected this time. Keep applying — more opportunities ahead!',
  },
  'Selected': {
    type: 'selected',
    title: '🏆 Offer! You\'ve been selected!',
    message: 'Amazing news — you have been selected! Check your email for next steps.',
  },
};

/**
 * Notify student when their application status changes
 */
const notifyApplicationStatusChange = async (studentId, status, companyName, applicationId) => {
  const template = STATUS_NOTIFICATION_MAP[status];
  if (!template) return;

  await createNotification(studentId, {
    ...template,
    message: `${companyName}: ${template.message}`,
    link: `/student/applications`,
    meta: { applicationId, companyName, status },
  });
};

/**
 * Notify all eligible students when a new drive is posted
 */
const notifyNewDrive = async (eligibleStudentIds, companyName, companyId) => {
  const notifications = eligibleStudentIds.map(studentId =>
    createNotification(studentId, {
      type: 'new_drive',
      title: `New placement drive: ${companyName}`,
      message: `${companyName} has announced a new placement drive. Check if you're eligible and apply!`,
      link: `/student/companies/${companyId}`,
      meta: { companyId, companyName },
    })
  );
  await Promise.allSettled(notifications);
};

/**
 * Notify student when AI resume analysis completes
 */
const notifyAIAnalysisComplete = async (studentId, fitScore, companyName) => {
  await createNotification(studentId, {
    type: 'ai_complete',
    title: 'AI resume analysis complete',
    message: companyName
      ? `Your resume scored ${fitScore}% fit for ${companyName}. View detailed analysis and suggestions.`
      : `AI analysis complete — your readiness score has been updated.`,
    link: '/student/ai-resume',
    meta: { fitScore, companyName },
  });
};

module.exports = { notifyApplicationStatusChange, notifyNewDrive, notifyAIAnalysisComplete };