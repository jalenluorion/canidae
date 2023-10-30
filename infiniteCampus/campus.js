const InfiniteCampus = require('./campus-backend.js');

async function getCourseInfo(districtName, state, username, password) {
  const user = new InfiniteCampus(districtName, state, username, password);

  return new Promise(async (resolve, reject) => {
    user.on('error', (err) => {
      reject(err);
    });

    try {
      // Wait until we are done logging in
      await new Promise((innerResolve) => {
        user.on('ready', innerResolve);
      });

      let currentTerm;
      let currentDate = new Date();
      if (currentDate.getMonth() < 6) {
        currentTerm = 1;
      } else {
        currentTerm = 0;
      }

      // Get grades from all courses, returns an array of terms containing class information
      const terms = await user.getCourses();

      // Extract and return the course information for the current term
      const courseInfo = terms[currentTerm].courses;

      // sort by courseInfo by the courseInfo.placement.periodSeq number ascending
      courseInfo.sort((a, b) => {
        return a.placement.periodSeq - b.placement.periodSeq;
      });

      resolve(courseInfo);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = getCourseInfo;