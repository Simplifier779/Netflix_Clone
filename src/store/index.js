import{
    configureStore,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import {API_KEY,TMBD_BASE_URL} from "../utils/constants";
import axios from "axios";


const initialState={
    movies:[],
    genresLoaded:false,
    genres:[],
}

const createArrayFromRawData=(array,moviesArray,genres)=>{
    array.forEach((movie)=>{
        const movieGenres=[];
        movie.genre_ids.forEach((genre)=>{
            const name=genres.find(({id})=>id===genre);
            //console.log(name);
            if(name) movieGenres.push(name.name);
        });
        if(movie.backdrop_path){
            moviesArray.push({
                id:movie.id,
                name:movie?.original_name ? movie.original_name : movie.original_title,
                image:movie.backdrop_path,
                genres:movieGenres.slice(0,3),
            });
        }
    })
    //console.log(moviesArray);
};
const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
      const {
        data: { results },
      } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      //console.log(results);
      createArrayFromRawData(results, moviesArray, genres);
    }
     
    return moviesArray;
  };
export const getGenres=createAsyncThunk("netflix/genres",async()=>{
    const {data:{genres},}=await axios.get(`${TMBD_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
     //console.log(genres);
    return genres;
});
export const fetchMovies=createAsyncThunk("netflix/trending",async({type},thunkApi)=>{
    const{netflix}=thunkApi.getState();
    //console.log(netflix.genres);
    return getRawData(`${TMBD_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,netflix.genres,true);
}
);

export const fetchDataByGenre=createAsyncThunk("netflix/moviesByGenres",async({genre,type},thunkApi)=>{
    const{netflix}=thunkApi.getState();
    return getRawData(`${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,netflix.genres);
}
);

export const getUserLikedMovies=createAsyncThunk("netflix/getLiked",async(email)=>{
    const {data:{movies}}=await axios.get(`http://localhost:3000/api/user/liked/${email}`)
    return movies;
});
export const removeFromLikedMovies=createAsyncThunk("netflix/deleteLiked",async({email,movieId})=>{
    const {data:{movies}}=await axios.put(`http://localhost:3000/api/user/delete`,{email,movieId})
    return movies;
});
const NetflixSlice=createSlice({
    name:"Netflix",
    initialState,
    extraReducers:(builder)=>{builder.addCase(getGenres.fulfilled,(state=initialState,action)=>{
        state.genres=action.payload;
        state.genresLoaded=true;
    });
    builder.addCase(fetchMovies.fulfilled,(state,action)=>{
        state.movies=action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled,(state,action)=>{
        state.movies=action.payload;
    });
    builder.addCase(getUserLikedMovies.fulfilled,(state,action)=>{
        state.movies=action.payload;
    });
    builder.addCase(removeFromLikedMovies.fulfilled,(state,action)=>{
        state.movies=action.payload;
    });
},
});
export const store=configureStore({ 
    reducer:{
        netflix:NetflixSlice.reducer,

    },
});