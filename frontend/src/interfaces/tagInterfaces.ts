export type Tag = { id: string; name: string };
export type Option = { value: string; label: string };

export type Props = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  userOnly?: boolean;
};

export type tag = { id: string; name: string };

export interface createTagInput {
  name: string;
}