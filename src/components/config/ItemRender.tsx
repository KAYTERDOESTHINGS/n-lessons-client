import { UserIcon } from "lucide-react";
import { getMediaImage, getNestedValue } from "../../services/utils";
import { ALIGNMENT } from "../../services/constant";

const basicRender = ({ content, align = ALIGNMENT.LEFT }: any) => {
  return (
    <span className={`text-gray-300 text-sm text-${align} whitespace-nowrap`}>
      {content}
    </span>
  );
};

const renderImage = ({
  label = "Ảnh",
  accessor = "avatarPath",
  Icon = UserIcon,
  align = ALIGNMENT.LEFT,
}) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => (
      <div
        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700`}
      >
        {getNestedValue(item, accessor) ? (
          <img
            src={getMediaImage(getNestedValue(item, accessor))}
            className="object-cover"
          />
        ) : (
          <Icon size={20} className={`text-white text-sm`} />
        )}
      </div>
    ),
  };
};

const renderActionButton = ({
  label = "Hành động",
  accessor = "action",
  align = ALIGNMENT.CENTER,
  renderChildren,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      return (
        <span className="flex items-center text-sm text-center justify-center space-x-1">
          {renderChildren?.(item)}
        </span>
      );
    },
  };
};

export { basicRender, renderImage, renderActionButton };
