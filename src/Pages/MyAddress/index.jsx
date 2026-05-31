import { useContext, useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { FaMapMarkerAlt, FaRegUser } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
} from "../../services/userService";
import "../MyAccount/index.css";

const emptyForm = {
  label: "",
  fullName: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  isDefault: false,
};

const MyAddress = () => {
  const context = useContext(MyContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formFields, setFormFields] = useState(emptyForm);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialAddresses = async () => {
      try {
        const data = await fetchAddresses();
        if (isMounted) {
          if (Array.isArray(data)) {
            setAddresses(data);
          } else if (Array.isArray(data?.addresses)) {
            setAddresses(data.addresses);
          } else {
            setAddresses([]);
          }
        }
      } catch (error) {
        console.error("Load addresses error:", error);
        if (isMounted) {
          setAddresses([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const data = await fetchAddresses();

      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (Array.isArray(data?.addresses)) {
        setAddresses(data.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Load addresses error:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Bắt lỗi bỏ trống
    if (!formFields.address_line.trim() || !formFields.city.trim()) {
      context.openAlertBox(
        "error",
        "Address line and city are required"
      );
      return;
    }

    // 2. Bắt lỗi trùng lặp dữ liệu (So sánh không phân biệt hoa thường và khoảng trắng thừa)
    const isDuplicate = addresses.some(
      (addr) =>
        addr.address_line?.trim().toLowerCase() === formFields.address_line.trim().toLowerCase() &&
        addr.city?.trim().toLowerCase() === formFields.city.trim().toLowerCase() &&
        (addr.state || "").trim().toLowerCase() === (formFields.state || "").trim().toLowerCase() &&
        (addr.pincode || "").trim().toLowerCase() === (formFields.pincode || "").trim().toLowerCase() &&
        (addr.country || "").trim().toLowerCase() === (formFields.country || "").trim().toLowerCase()
    );

    if (isDuplicate) {
      context.openAlertBox(
        "error",
        "This address already exists!"
      );
      return; // Dừng hàm lại, không gửi lên server
    }

    // 3. Gọi API lưu nếu dữ liệu hợp lệ
    try {
      setSaving(true);

      await createAddress({
        ...formFields,
        mobile: context.user?.phone || "",
      });

      setFormFields(emptyForm);

      context.openAlertBox("success", "Address added");

      await loadAddresses();
    } catch (error) {
      context.openAlertBox(
        "error",
        error?.message || "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      context.openAlertBox("success", "Default address updated");
      await loadAddresses();
    } catch (error) {
      context.openAlertBox(
        "error",
        error?.message || "Failed to update default address",
      );
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);

      context.openAlertBox("success", "Address removed");

      await loadAddresses();
    } catch (error) {
      context.openAlertBox(
        "error",
        error?.message || "Failed to remove address"
      );
    }
  };

  return (
    <section className="myAccount">
      <div className="container">
        <div className="myAccount__wrapper">
          <AccountSidebar />

          <div className="myAccount__content">
            <div className="myAccount__card">
              <div className="myAccount__header">
                <h2>My Addresses</h2>
              </div>

              {loading ? (
                <p style={{ color: "#64748b" }}>
                  Loading addresses...
                </p>
              ) : addresses.length === 0 ? (
                <p
                  style={{
                    color: "#64748b",
                    marginBottom: 16,
                  }}
                >
                  No saved addresses yet.
                </p>
              ) : (
                <div className="addressGrid">
                  {addresses.map((address) => (
                    <div
                      key={address._id || address.id}
                      className="addressCard"
                    >
                      <div className="addressCard__icon">
                        <FaMapMarkerAlt />
                      </div>

                      <div className="addressCard__body">
                        <div className="addressCard__top">
                          <div>
                            <h3>{address.label || "Saved address"}</h3>
                            <p>
                              <FaRegUser />
                              {address.fullName || context.user?.name || "Receiver"}
                            </p>
                          </div>
                        </div>

                        <p className="addressCard__line">
                          {address.address_line}, {address.city}
                          {address.state
                            ? `, ${address.state}`
                            : ""}
                          {address.pincode
                            ? ` ${address.pincode}`
                            : ""}
                          {address.country
                            ? `, ${address.country}`
                            : ""}
                        </p>

                        <p className="addressCard__meta">
                          Contact phone is managed in your profile.
                        </p>
                      </div>

                      <div className="addressCard__side">
                        {address.isDefault ? (
                          <span className="addressCard__badge">Default</span>
                        ) : (
                          <button
                            type="button"
                            className="addressCard__primaryAction"
                            onClick={() =>
                              handleSetDefault(address._id || address.id)
                            }
                          >
                            Set default
                          </button>
                        )}

                        <button
                          type="button"
                          className="addressCard__removeAction"
                          onClick={() =>
                            handleDelete(address._id || address.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form
                className="myAccount__form addressForm"
                onSubmit={handleSubmit}
              >
                <div className="addressForm__head">
                  <div className="addressForm__title">
                    <h3>Add New Address</h3>
                    <p>Saved addresses are used for billing and delivery records.</p>
                  </div>
                </div>

                <div className="addressForm__grid">
                  <label className="addressField">
                    <span>Label</span>
                    <input
                      type="text"
                      placeholder="Home, Office"
                      value={formFields.label}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          label: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField">
                    <span>Receiver name</span>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formFields.fullName}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          fullName: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField addressField--wide">
                    <span>Address line</span>
                    <input
                      type="text"
                      placeholder="Street, building, room"
                      value={formFields.address_line}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          address_line: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField">
                    <span>City</span>
                    <input
                      type="text"
                      placeholder="City"
                      value={formFields.city}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          city: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField">
                    <span>State</span>
                    <input
                      type="text"
                      placeholder="State or province"
                      value={formFields.state}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          state: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField">
                    <span>Pincode</span>
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={formFields.pincode}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          pincode: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="addressField">
                    <span>Country</span>
                    <input
                      type="text"
                      placeholder="Country"
                      value={formFields.country}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          country: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="addressForm__actions">
                  <label className="accountCheck">
                    <input
                      type="checkbox"
                      checked={formFields.isDefault}
                      onChange={(event) =>
                        setFormFields({
                          ...formFields,
                          isDefault: event.target.checked,
                        })
                      }
                    />
                    <span>Set as default address</span>
                  </label>

                  <button type="submit" disabled={saving}>
                    {saving ? "SAVING..." : "ADD ADDRESS"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAddress;
