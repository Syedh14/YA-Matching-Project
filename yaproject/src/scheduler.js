

export function findAvailableMeetingTimes(mentor, mentee) {
    const mentorAvailability = mentor.availability;
    const menteeAvailability = mentee.availability;
  
    if (!mentorAvailability || !menteeAvailability) {
      return [];
    }
  
    const recommendedTimes = [];
  
    for (const day in mentorAvailability) {
      if (menteeAvailability.hasOwnProperty(day)) {
        const mentorSlots = mentorAvailability[day];
        const menteeSlots = menteeAvailability[day];
  
        for (const mentorSlot of mentorSlots) {
          const [mentorStart, mentorEnd] = mentorSlot.split("-").map(parseTime);
  
          for (const menteeSlot of menteeSlots) {
            const [menteeStart, menteeEnd] = menteeSlot.split("-").map(parseTime);
  
            if (mentorStart < menteeEnd && menteeStart < mentorEnd) {
              const overlapStart = Math.max(mentorStart, menteeStart);
              const overlapEnd = Math.min(mentorEnd, menteeEnd);
  
              recommendedTimes.push(
                `🗓 ${capitalize(day)}: ${formatTime(overlapStart)}–${formatTime(overlapEnd)}`
              );
            }
          }
        }
      }
    }
  
    return recommendedTimes;
  }
  
  export function scheduleMeetingsForMatches(matches, mentors, mentees) {
    const recommendations = {};
  
    matches.forEach(match => {
      const mentor = mentors.find(m => m.id === match.mentorId);
      const mentee = mentees.find(m => m.id === match.menteeId);
  
      if (mentor && mentee) {
        const times = findAvailableMeetingTimes(mentor, mentee);
        recommendations[`Mentor ${mentor.id} - Mentee ${mentee.id}`] = times;
      }
    });
  
    return recommendations;
  }
  
  // Helpers
  function parseTime(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }
  
  function formatTime(mins) {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  