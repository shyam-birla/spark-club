const ResourceCategory = ({ title, items }) => {
  return (
    <section className="bg-white rounded-lg p-6 shadow-md mb-12">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResourceCategory;
