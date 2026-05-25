import "./index.css"
import AccountSidebar from '../AccountSidebar'

const MyListItem = () => {
    return (
        <section className="myList">
            <div className="container">
                <div className="myList__wrapper">
                    {/* SIDEBAR */}

                    <AccountSidebar />

                    {/* CONTENT */}

                    <div className="myList__content">
                        {/* HEADER */}

                        <div className="myList__header">
                            <h2>My List</h2>

                            <p>
                                There are <span>0</span> products
                                in your My List
                            </p>
                        </div>

                        {/* EMPTY */}

                        <div className="myList__empty">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                alt=""
                            />

                            <h3>
                                Your wishlist is empty
                            </h3>

                            <p>
                                Save your favorite products
                                to your wishlist and shop
                                them later anytime.
                            </p>

                            <a href="/productListing">
                                CONTINUE SHOPPING
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyListItem