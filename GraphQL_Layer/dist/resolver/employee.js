export const resolvers = {
    Query: {
        async signin(_, args) {
            const response = await fetch(`http://localhost:3000/api/v1/auth/signin`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(args.input),
            });
            const data = await response.json();
            console.log(data);
            return data;
        }
    }
};
