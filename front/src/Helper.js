import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// function wrapPromise(promise) {
//   let status = 'pending'
//   let response

//   const suspender = promise.then(
//     (res) => {
//       status = 'success'
//       response = res
//     },
//     (err) => {
//       status = 'error'
//       response = err
//     },
//   )
//   const read = () => {
//     switch (status) {
//       case 'pending':
//         throw suspender
//       case 'error':
//         throw response
//       default:
//         return response
//     }
//   }

//   return { read };
// }

let resolvePromiseFunction;

function resolvePromise(reason) {
  if (resolvePromiseFunction) {
    resolvePromiseFunction(reason);
  }
}

function fetchPromise() {
  const customPromise = new Promise((resolve) => {
    resolvePromiseFunction = resolve;
  })
    .then((res) => res)
    
  return customPromise
}

function fetchTimedPromise() {
  const customPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve("hi");
    }, 3000);
  })
    .then((res) => res)
    
  return (customPromise)
}

export {
  api,
  resolvePromise,
  fetchPromise,
  fetchTimedPromise,
}