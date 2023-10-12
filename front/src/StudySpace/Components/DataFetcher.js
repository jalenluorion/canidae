let status = "pending";
let result = null;

function fetchShows () {
const suspender = new Promise((resolve, reject) => {
  setTimeout(() => {
    const data = <p>hi</p>
    status = "success";
    result = data;
    resolve();
  }, 4000);
});

return {
  read() {
    if (status === "pending") {
      throw suspender;
    } else if (status === "error") {
      throw result;
    } else if (status === "success") {
      return result;
    }
  },
};
}

export default fetchShows;