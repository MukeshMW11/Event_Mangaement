import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import { useTags } from "../hooks/useTags";
import type { Option, Props, Tag } from "../interfaces/tagInterfaces";



export function TagSelect({ value, onChange, userOnly }: Props) {
  const [search, setSearch] = useState("");
  const LIMIT = 20;

  const { data: tags = [], isLoading } = useTags(search, userOnly, LIMIT);

  const options: Option[] = tags.map((tag: Tag) => ({
    value: tag.id,
    label: tag.name
  }));

  const debouncedSetSearch = useRef(
    debounce((value: string) => setSearch(value), 300)
  );

  useEffect(() => {
    return () => debouncedSetSearch.current.cancel();
  }, []);

  return (
    <Select
      isMulti
      className="text-sm w-full"
      classNamePrefix="event-tag-select"
      options={options}
      isLoading={isLoading}
      value={value.map((tag) => ({ value: tag.id, label: tag.name }))}
      onChange={(selected) => {
        onChange((selected || []).map((s) => ({ id: s.value, name: s.label })));
      }}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: 36,
          height: 36,
        }),
        valueContainer: (base) => ({
          ...base,
          maxHeight: 36,
          overflowY: "auto",
          overflowX: "hidden",
        }),
        multiValue: (base) => ({
          ...base,
          marginTop: 2,
          marginBottom: 2,
        }),
      }}
      onInputChange={(inputValue, meta) => {
        if (meta.action === "input-change") {
          debouncedSetSearch.current(inputValue);
        }
        if (meta.action === "menu-close" || meta.action === "input-blur") {
          debouncedSetSearch.current.cancel();
          setSearch("");
        }
      }}
      placeholder="Search tags..."
      noOptionsMessage={() => "No tags found"}
    />
  );
}