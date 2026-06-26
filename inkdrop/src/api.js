const BASE = 'https://jsonplaceholder.typicode.com'
export const api = {
  getPosts:     ()   => fetch(`${BASE}/posts`).then(r=>r.json()),
  getPost:      (id) => fetch(`${BASE}/posts/${id}`).then(r=>r.json()),
  getComments:  (id) => fetch(`${BASE}/posts/${id}/comments`).then(r=>r.json()),
  getUsers:     ()   => fetch(`${BASE}/users`).then(r=>r.json()),
  getUser:      (id) => fetch(`${BASE}/users/${id}`).then(r=>r.json()),
  getUserPosts: (id) => fetch(`${BASE}/users/${id}/posts`).then(r=>r.json()),
}
