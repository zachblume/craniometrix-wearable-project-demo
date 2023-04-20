import { keyframes } from "@emotion/react";

const Table = ({ rows }) => {
    return (
        <div className="mt-8 flow-root">
            <div className="-my-2 overflow-x-auto mx-2 sm:-mx-6  lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {rows?.length &&
                                        Object.keys(rows[0]).map((columnTitle, i) => (
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                key={i}
                                            >
                                                {columnTitle}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {rows?.map((row, rowNum) => (
                                    <tr key={rowNum}>
                                        {Object.entries(row).map(([columnKey, value]) => (
                                            <td
                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                key={columnKey}
                                            >
                                                {" "}
                                                {value}
                                            </td>
                                        ))}
                                        {/* 
                             <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        Front-end Developer
                                    </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Table;
