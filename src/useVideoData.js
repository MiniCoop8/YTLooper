import React from 'react'
import { useQuery } from 'react-query'
import axios from 'axios';

const useVideoData = (label, vid) => {
    const getVideoData = () => {
        if (vid) {
            var url = 'https://www.youtube.com/watch?v=' + vid;
            return axios.get('https://noembed.com/embed', {
                crossDomain: true,
                params:{
                        format: 'json', 
                        url: url
                    } 
            })
            .then(res => res.data) 
        }
    }

    const query = useQuery([label, vid], () => getVideoData())
    return query 
}
export default useVideoData