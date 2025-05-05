export const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };
  
  export const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  