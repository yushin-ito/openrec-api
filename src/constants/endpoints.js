// const endpoint = 

export default {
    getMovieList: (userId) => `https://public.openrec.tv/external/api/v5/movies?channel_ids=${userId}&sort=onair_status&is_upload=false`
}