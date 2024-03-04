export const decodeJwtToken=(token)=> {
    try {
      const decodedToken = atob(token.split('.')[1]);
      return {...JSON.parse(decodedToken),token};
    } catch (error) {
      console.error('Error decoding JWT token:', error.message);
      return null;
    }
  }
  