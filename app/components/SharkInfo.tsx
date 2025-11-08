const SharkInfo = () => {
    return (
      <div className=" p-6  mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Shark Activity Summary
        </h2>
  
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Tiger Shark Seasonality
          </h3>
          <p>
            Tiger sharks are the most dangerous from{" "}
            <span className="font-semibold">October 14 to November 7</span>,
            peaking around <span className="font-semibold">October 31</span>.
          </p>
          <p>
            During this period, you are{" "}
            <span className="font-semibold text-red-600">
              about five times more likely
            </span>{" "}
            to be bitten by a tiger shark than at other times of the year.
          </p>
          <p>
            For the rest of the year, tiger shark activity remains fairly steady.
          </p>
        </section>
  
        <hr className="border-gray-200" />
  
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Great White Sharks
          </h3>
          <p>
            Great white sharks are mostly present in{" "}
            <span className="font-semibold">late winter</span>. A confirmed
            fatality from a great white happened on{" "}
            <span className="font-semibold">Maui in early December</span>.
          </p>
          <p>
            While shark incidents are less common after mid-November, great whites
            can contribute to{" "}
            <span className="font-semibold text-red-600">
              more deadly attacks
            </span>{" "}
            during the winter months.
          </p>
          <p>
            Learn more about great white migratory patterns at{" "}
            <a
              className="text-blue-600 hover:underline"
              href="https://sharkstewards.org/sharktober-the-return-of-the-great-white-sharks/"
              target="_blank"
              rel="noopener noreferrer"
            >
              sharkstewards.org
            </a>
            .
          </p>
        </section>
      </div>
    );
  };
  
  export default SharkInfo;
  