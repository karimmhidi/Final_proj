import axios from'axios';
const backendUrl = 'http://localhost:3000/';

export const LatestSearchedUrls = async (limit) => {
    try {
        const response = await axios.get(`${backendUrl}latest-searched-urls/${limit}`);
        return response; // Assuming the response contains the array of URLs
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};


export const summarizeData =async (data)=> {
    try {
        const response = await axios.post(`${backendUrl}summarize`,data);
        return response;
    } catch (error){
        console.error(error.message);
        throw error;
    }
};

export const roast = async (data)=> {
    try {
        const response =await axios.post(`${backendUrl}roast`,data);
        return response;
    } catch (error){
        console.error(error.message);
        throw error;
    }
};
