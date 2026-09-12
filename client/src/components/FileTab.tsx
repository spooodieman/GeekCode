type Props = {
  language: string;
};

const FileTab: React.FC<Props> = ({ language }: Props) => {
  return (
    <div>
      <h2 className="text-md font-semibold mb-2">{language}</h2>
    </div>
  );
};
export default FileTab;
