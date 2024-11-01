/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import "./style.scss";
import "./editor.scss";

const __ = wp.i18n.__; // The __() for internationalization.
const registerBlockType = wp.blocks.registerBlockType; // The registerBlockType() to register blocks.
const { MediaUpload, PlainText } = wp.editor;

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("testimonial-block/block-testimonial", {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __("Testimonials"), // Block title.
  icon: "format-quote", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [__("Testimonials"), __("tr")],

  attributes: {
    id: {
      source: "attribute",
      selector: ".carousel.slide",
      attribute: "id"
    },
    testimonials: {
      source: "query",
      default: [],
      selector: "blockquote.testimonial",
      query: {
        image: {
          source: "attribute",
          selector: "img",
          attribute: "src"
        },
        index: {
          source: "text",
          selector: "span.testimonial-index"
        },
        content: {
          source: "text",
          selector: "p.testimonial-texts"
        },
        author: {
          source: "text",
          selector: "h4.testimonial-author"
        },
        link: {
          source: "text",
          selector: ".testimonial-author-links"
        }
      }
    }
  },

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */

  // The "edit" property must be a valid function.
  edit: props => {
    const { testimonials } = props.attributes;

    if (!props.attributes.id) {
      const id = `testimonial${Math.floor(Math.random() * 100)}`;
      props.setAttributes({
        id
      });
    }

    const testimonialsList = testimonials
      .sort((a, b) => a.index - b.index)
      .map(testimonial => {
        return (
          <div className="gts-testimonial-block">
            <p>
              <span>
                Insert Testmonial {Number(testimonial.index) + 1} Here:
              </span>
              <span
                className="remove-testimonial"
                onClick={() => {
                  const newTestimonials = testimonials
                    .filter(item => item.index != testimonial.index)
                    .map(t => {
                      if (t.index > testimonial.index) {
                        t.index -= 1;
                      }

                      return t;
                    });

                  props.setAttributes({
                    testimonials: newTestimonials
                  });
                }}
              >
                <i className="fa fa-times" />
              </span>
            </p>
            <blockquote className="wp-block-quote">
              {/* <label>Content:</label> */}
              <PlainText
                className="content-plain-text"
                style={{ height: 58 }}
                placeholder="Add Testimonial Text"
                value={testimonial.content}
                autoFocus
                onChange={content => {
                  const newObject = Object.assign({}, testimonial, {
                    content: content
                  });
                  props.setAttributes({
                    testimonials: [
                      ...testimonials.filter(
                        item => item.index != testimonial.index
                      ),
                      newObject
                    ]
                  });
                }}
              />
              <div className="row">
                <div className="gts__picture col-3">
                  <MediaUpload
                    onSelect={media => {
                      const image = media.sizes.medium
                        ? media.sizes.medium.url
                        : media.url;
                      const newObject = Object.assign({}, testimonial, {
                        image: image
                      });
                      props.setAttributes({
                        testimonials: [
                          ...testimonials.filter(
                            item => item.index != testimonial.index
                          ),
                          newObject
                        ]
                      });
                    }}
                    type="image"
                    value={testimonial.image}
                    render={({ open }) =>
                      !!testimonial.image ? (
                        <div>
                          {props.isSelected && (
                            <div className="gts__picture__actions">
                              <a
                                href="#"
                                className="removebtn"
                                onClick={() => {
                                  const newObject = Object.assign(
                                    {},
                                    testimonial,
                                    {
                                      image: null
                                    }
                                  );
                                  props.setAttributes({
                                    testimonials: [
                                      ...testimonials.filter(
                                        item => item.index != testimonial.index
                                      ),
                                      newObject
                                    ]
                                  });
                                }}
                              >
                                × Remove
                              </a>
                            </div>
                          )}

                          <div
                            className="gts__picture__image"
                            style={{
                              backgroundImage: `url(${testimonial.image})`
                            }}
                            onClick={open}
                          />
                        </div>
                      ) : (
                        <a
                          href="#"
                          className="gts__picture__image"
                          onClick={open}
                        >
                          Select Image
                        </a>
                      )
                    }
                  />
                </div>
                <div className="col-9 mt-3">
                  <PlainText
                    className="author-plain-text"
                    placeholder="Author Name"
                    value={testimonial.author}
                    onChange={author => {
                      const newObject = Object.assign({}, testimonial, {
                        author: author
                      });
                      props.setAttributes({
                        testimonials: [
                          ...testimonials.filter(
                            item => item.index != testimonial.index
                          ),
                          newObject
                        ]
                      });
                    }}
                  />
                  {/* <label>Link:</label> */}
                  <PlainText
                    className="link-plain-text"
                    placeholder="Add Possition"
                    value={testimonial.link}
                    onChange={link => {
                      const newObject = Object.assign({}, testimonial, {
                        link: link
                      });
                      props.setAttributes({
                        testimonials: [
                          ...testimonials.filter(
                            item => item.index != testimonial.index
                          ),
                          newObject
                        ]
                      });
                    }}
                  />
                </div>
              </div>
            </blockquote>
          </div>
        );
      });
    return (
      <div className={props.className}>
        {testimonialsList}
        <button
          className="add-more-testimonial"
          onClick={content =>
            props.setAttributes({
              testimonials: [
                ...props.attributes.testimonials,
                {
                  index: props.attributes.testimonials.length,
                  content: "",
                  author: "",
                  link: ""
                }
              ]
            })
          }
        >
          +
        </button>
      </div>
    );
  },

  /**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  save: props => {
    const { id, testimonials } = props.attributes;
    const carouselIndicators = testimonials.map(function(testimonial, index) {
      return (
        <li
          data-target={"#" + id}
          data-slide-to={index}
          className={testimonial.index == 0 ? "active" : ""}
        />
      );
    });
    const testimonialsList = testimonials.map(function(testimonial) {
      const carouselClass =
        testimonial.index == 0 ? "carousel-item active" : "carousel-item";
      return (
        <div className="extra">
          <blockquote className="testimonial single-testimonial-item">
              {testimonial.image && (
                <div className="clint-img rounded-circle">
                  <img src={testimonial.image} />
                </div>
              )}
              <h4 className="text-dark2 m-0 testimonial-author">{testimonial.author}</h4>
              <p className="text-light-dark fz-poppins testimonial-author-links">
                  {testimonial.link}
              </p>
              <p className="mb-4 pt-2 testimonial-texts">
                  <i>
                      {testimonial.content}
                  </i>
              </p>
              <i class="icofont-quote-right pt-2 d-inline-block text-active"></i>

          </blockquote>
        </div>
      );
    });
    if (testimonials.length > 0) {
      return (
        <section className="testimonial-sliders m-pt-140  m-pb-140 m-bg-1">
          <div className="testimonial-slider testimonial-slider2">
              {testimonialsList}
          </div>
        </section>
      );
    } else return null;
  }
});