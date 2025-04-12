import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
} from "@mui/icons-material";
import propTypes from "prop-types";
import { formatPrice } from "../../Common/helpers";

export default function ProductAdmin(props) {
  const {
      id,
      code,
      cover,
      name,
      price,
      description,
      visible,
      setProductSelected,
      setShowDeleteModal,
      setShowEditModal,
      setShowHiddenModal,
      setShowVisibleModal,
    } = props,
    productProps = { name, description, price, cover, code, visible, id };
  return (
    <tr className="border-b-2 border-slate-300 bg-gray-100 text-gray-900 h-[90px]">
      <td className="px-4 py-2 text-center">{code}</td>
      <td className="px-4 py-2 text-center">{name}</td>
      <td className="px-4 py-2 text-center">{description}</td>
      <td className="px-4 py-2 text-center">${formatPrice(price)}</td>
      <td className="px-4 py-2">
        <div className="flex gap-4 justify-center w-full items-center brightness-95 ">
          <EditIcon
            size={16}
            color="#fff"
            className="bg-blue-500 hover:bg-blue-600 p-1 w-14 h-14 scale-150 text-white rounded-lg duration-75 cursor-pointer"
            onClick={() => {
              setProductSelected(productProps);
              setShowEditModal(true);
            }}
          />
          {visible ? (
            <EyeIcon
              size={18}
              color="#fff"
              className="bg-slate-500 text-white p-1 w-14 h-14 scale-150 rounded-lg hover:bg-slate-600 duration-75 cursor-pointer"
              onClick={() => {
                setProductSelected(productProps);
                setShowVisibleModal(true);
              }}
            />
          ) : (
            <EyeOffIcon
              size={18}
              color="#fff"
              className="bg-slate-500 text-white p-1 w-14 h-14 scale-150 rounded-lg hover:bg-slate-600 duration-75 cursor-pointer"
              onClick={() => {
                setProductSelected(productProps);
                setShowHiddenModal(true);
              }}
            />
          )}
          <DeleteIcon
            size={10}
            color="#fff"
            className="bg-red-500 text-white p-1 w-14 h-14 scale-150 rounded-lg hover:bg-red-600 duration-75 cursor-pointer"
            onClick={() => {
              setProductSelected(productProps);
              setShowDeleteModal(true);
            }}
          />
        </div>
      </td>
    </tr>
  );
}

ProductAdmin.propTypes = {
  id: propTypes.string,
  name: propTypes.string,
  description: propTypes.string,
  price: propTypes.number,
  cover: propTypes.string,
  code: propTypes.string,
  setShowDeleteModal: propTypes.func,
  setProductSelected: propTypes.func,
  setShowEditModal: propTypes.func,
  setShowHiddenModal: propTypes.func,
  setShowVisibleModal: propTypes.func,
  visible: propTypes.bool,
};
