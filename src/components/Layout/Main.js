const Main = ({ children }) => {
    return (
        <div className="flow-root">
            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-6 align-middle px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default Main;
