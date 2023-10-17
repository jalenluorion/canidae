import axios from 'axios';

export const api = axios.create({
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

export function resolvePromise() {
  if (resolvePromiseFunction) {
    resolvePromiseFunction("hi");
  }
}

export function fetchPromise() {
  const customPromise = new Promise((resolve) => {
    resolvePromiseFunction = resolve;
  })
    .then((res) => res)
    
  return customPromise
}

export function fetchTimerDate() {
  const customPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve("hi");
    }, 3000);
  })
    .then((res) => res)
    
  return (customPromise)
}