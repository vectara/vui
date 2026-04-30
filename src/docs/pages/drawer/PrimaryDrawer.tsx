import { useState } from "react";
import {
  addNotification,
  VuiButtonPrimary,
  VuiButtonSecondary,
  VuiDrawer,
  VuiFlexContainer,
  VuiModal,
  VuiNotifications,
  VuiSpacer,
  VuiText,
  VuiToggle
} from "../../../lib";
import { BiInfoCircle } from "react-icons/bi";
import { FormGroup } from "../searchSelect/FormGroup";

export const PrimaryDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFooter, setHasFooter] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <VuiButtonPrimary color="primary" onClick={() => setIsOpen(true)}>
        Open primary drawer
      </VuiButtonPrimary>

      <VuiSpacer size="m" />

      <VuiToggle label="Include footer" checked={hasFooter} onChange={() => setHasFooter(!hasFooter)} />

      <VuiDrawer
        color="primary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        icon={<BiInfoCircle />}
        title="FYI"
        footer={
          hasFooter && (
            <VuiFlexContainer alignItems="center" justifyContent="spaceBetween">
              <VuiFlexContainer spacing="s">
                <VuiButtonSecondary color="neutral" onClick={() => setIsOpen(false)}>
                  Cancel
                </VuiButtonSecondary>

                <VuiButtonSecondary color="danger" onClick={() => setIsOpen(false)}>
                  Delete
                </VuiButtonSecondary>
              </VuiFlexContainer>

              <VuiButtonPrimary color="primary" onClick={() => setIsOpen(false)}>
                Save changes
              </VuiButtonPrimary>
            </VuiFlexContainer>
          )
        }
      >
        <VuiButtonSecondary
          color="primary"
          onClick={() => {
            addNotification({
              color: "primary",
              message: "Just some information, FYI"
            });
          }}
        >
          Add notification
        </VuiButtonSecondary>

        <VuiSpacer size="m" />

        <VuiButtonSecondary color="primary" onClick={() => setIsModalOpen(true)}>
          Open modal from drawer
        </VuiButtonSecondary>

        <VuiSpacer size="m" />

        <VuiText>
          <p>I just thought you should know that your drawer is showing.</p>
        </VuiText>

        <VuiSpacer size="l" />

        <VuiButtonSecondary color="primary">A no-op button for testing a11y</VuiButtonSecondary>

        <VuiSpacer size="l" />

        <VuiText size="s">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>
            Paragraph with some <strong>bold</strong> and <em>emphasized</em> words in it. Let's make this really,
            really, really, super-duper, <code>ridiculously long</code> just so we can be sure the text wraps and you
            can get idea of the line-height.<sup>5</sup>
          </p>

          <p>
            Text with some <code>code</code> and{" "}
            <strong>
              <code>bolded code</code>
            </strong>
            .
          </p>

          <blockquote>
            <p>
              A long paragraph of text that's inside a blockquote. This is to demonstrate how blockquotes look when used
              in conjunction with the VuiText component. The quick brown fox jumps over the lazy dog. The quick brown
              fox jumps over the lazy dog.
            </p>
          </blockquote>

          <hr />

          <p>
            Here's another paragraph with a <a href="#">link</a> in it.
          </p>

          <ul>
            <li>One potato</li>
            <li>Two potato</li>
            <li>Three potato</li>
            <li>Four</li>
          </ul>

          <ol>
            <li>Five potato</li>
            <li>Six potato</li>
            <li>Seven potato</li>
            <li>More</li>
          </ol>

          <p>
            <code>(code) doc.title='Vectara'</code>
          </p>

          <p>
            <pre>(pre) doc.title='Vectara'</pre>
          </p>

          <blockquote>
            <pre>
              <code>
                # Markdown's Grace *Italic* and **bold**, `Code` unfolds, &gt; Quotes that sing, &gt; In Markdown's
                ring.
              </code>
            </pre>
          </blockquote>

          <pre>
            <code>
              {`# Markdown's Grace

*Italic* and **bold**,  
\`Code\` unfolds,  
> Quotes that sing,  
> In Markdown's ring.`}
            </code>
          </pre>

          <code>
            {`# Markdown's Grace

*Italic* and **bold**,  
\`Code\` unfolds,  
> Quotes that sing,  
> In Markdown's ring.`}
          </code>

          <table>
            <thead>
              <tr>
                <th> Line </th>
                <th> Entry </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>1</code>
                </td>
                <td> A gull of memory crosses low, backlit and slow. </td>
              </tr>
              <tr>
                <td>
                  <code>2</code>
                </td>
                <td> Quiet interest gathers on a breath I did not spend. </td>
              </tr>
              <tr>
                <td>
                  <code>3</code>
                </td>
                <td> Moon counts the hours like coins within a tray. </td>
              </tr>
              <tr>
                <td>
                  <code>4</code>
                </td>
                <td> I sign in trembling script: return by day. </td>
              </tr>
            </tbody>
          </table>
        </VuiText>
        <VuiSpacer size="l" />
        <FormGroup />
        <VuiSpacer size="l" />
      </VuiDrawer>

      <VuiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="I'm a modal inside a drawer!">
        <VuiText>
          <p>
            This modal is rendered inside the drawer. It demonstrates that you can have multiple layers of overlays and
            that the focus management and scroll locking still work as expected.
          </p>
        </VuiText>

        <VuiSpacer size="m" />

        <VuiButtonSecondary
          color="primary"
          onClick={() => {
            addNotification({
              color: "primary",
              message: "Just some information, FYI"
            });
          }}
        >
          Add notification
        </VuiButtonSecondary>
      </VuiModal>

      <VuiNotifications />
    </>
  );
};
