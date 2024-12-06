import SearchListItem from "./SearchListItem";

export default function SearchList({ searchResult }) {
  return (
    <div>
      <SearchListItem listItems={searchResult} />
    </div>
  );
}
