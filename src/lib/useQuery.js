import useSwr from "swr";

const useQuery = (query) => {
    const fetcher = async () => {
        const { data, error } = await query;
        if (error) throw error;
        return data;
    };
    return useSwr(query?.url?.href, fetcher);
};

export { useQuery };
