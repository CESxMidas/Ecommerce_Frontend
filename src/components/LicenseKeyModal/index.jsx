import { IoClose, IoCopy } from "react-icons/io5";
import "./index.css";

function collectLicenseKeysFromOrder(order) {
  if (!order?.items?.length) {
    return [];
  }

  return order.items.flatMap((item) =>
    (item.licenseKeys || []).map((key) => ({
      key,
      productName: item.product?.name || item.product?.title || "Product",
    })),
  );
}

const LicenseKeyModal = ({ open, order, onClose }) => {
  if (!open || !order) {
    return null;
  }

  const keys = collectLicenseKeysFromOrder(order);

  const copyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="licenseKeyOverlay" role="dialog" aria-modal="true">
      <div className="licenseKeyModal">
        <button
          type="button"
          className="licenseKeyClose"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose />
        </button>

        <h2>Your license key</h2>
        <p className="licenseKeySubtitle">
          Order #{order.id} — copy the key below and paste it into your bypass
          tool.
        </p>

        {keys.length === 0 ? (
          <p className="licenseKeyEmpty">No keys found for this order.</p>
        ) : (
          <ul className="licenseKeyList">
            {keys.map((entry) => (
              <li key={entry.key} className="licenseKeyItem">
                <span className="licenseKeyProduct">{entry.productName}</span>
                <code className="licenseKeyCode">{entry.key}</code>
                <button
                  type="button"
                  className="licenseKeyCopy"
                  onClick={() => copyKey(entry.key)}
                >
                  <IoCopy />
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="licenseKeyDone" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default LicenseKeyModal;

export { collectLicenseKeysFromOrder };
