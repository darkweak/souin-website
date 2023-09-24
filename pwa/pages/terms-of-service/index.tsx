import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { List, Title } from 'components/common/text';
import getConfig from 'next/config';
import Head from 'components/layout/head';
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

const contact_mail =
  serverRuntimeConfig.CONTACT_EMAIL || publicRuntimeConfig.CONTACT_EMAIL;
const address = serverRuntimeConfig.ADDRESS || publicRuntimeConfig.ADDRESS;

const ToS: NextPage = () => (
  <>
    <Head title="Terms of service" />
    <Title title="Terms of service" />
    <article className="max-w-full prose md:prose-xl pt-8">
      <p>
        These general terms and conditions govern the use of the souin.app
        website. This site is owned and managed by Mr. Sylvain COMBRAQUE.
      </p>
      <p>
        By using this site, you indicate that you have read and understood the
        conditions of use and that you agree to abide by them at all times.
      </p>
      <p>Type of site : Saas</p>
      <h2>Intellectual property</h2>
      <p>
        All content published and made available on this site is the property of
        Sylvain COMBRAQUE and its creators. That includes, but is not limited to
        images, text, logos, documents, downloadable files and anything else
        that contributes to the composition of this site.
      </p>

      <h2>Accounts</h2>
      <p>When you create an account on our site, you agree to the following:</p>
      <List
        items={[
          'that you are solely responsible for your account and the security and confidentiality of your account, including any passwords or sensitive information attached to such account, and',
          'that all personal information you provide to us through your account is current, accurate and truthful and that you will update your personal information if it changes.',
        ]}
      />
      <p>
        We reserve the right to suspend or terminate your account if you use our
        site illegally or violate the Terms of Acceptable Use.
      </p>
      <h2>Sales of Goods and Services</h2>
      <p>
        This document governs the sale of the services made available on our
        site.
      </p>
      <p>The services we offer include:</p>
      <List items={['HTTP cache management']} />
      <p>
        The services linked to this document are the services that are displayed
        on our site at the time you access it. All information, descriptions or
        images that we provide about our services are described and presented
        with the greatest possible accuracy. However, we are not legally bound
        by such information, descriptions or images as we cannot guarantee the
        accuracy of every product or service we provide. You agree to purchase
        these services at your own risk.
      </p>
      <h2>Payments</h2>
      <p>We accept the following payment methods on this site:</p>
      <List items={['Credit card']} />
      <p>
        When you provide us with your payment information, you confirm to us
        that you have authorized the use of and access to the payment instrument
        you have chosen to use. By providing us with your payment details, you
        confirm that you authorize us to charge the amount due to this payment
        instrument.
      </p>
      <p>
        If we believe your payment has violated any law or any of our terms of
        service, we reserve the right to cancel your transaction.
      </p>
      <h3>Services</h3>
      <p>The services will be fully invoiced when the service is ordered.</p>
      <h3>Subscriptions</h3>
      <p>
        All of our recurring subscriptions will be automatically billed and
        renewed until we receive notice that you wish to cancel the
        subscription.
      </p>
      <h2>Liability limitation</h2>
      <p>
        Sylvain COMBRAQUE or one of his employees will be held responsible for
        any problem arising from this site. Nevertheless, Sylvain COMBRAQUE and
        his employees will not be held responsible for any problem resulting
        from any irregular use of this site.
      </p>
      <h2>Indemnity</h2>
      <p>
        As a user, you hereby indemnify Sylvain COMBRAQUE from any and all
        liability, costs, causes of action, damages or expenses arising out of
        your use of this site or your breach of any of the provisions set out in
        this document.
      </p>
      <h2>Applicable laws</h2>
      <p>
        This document is subject to the laws applicable in France and aims to
        comply with its necessary rules and regulations. This includes the
        EU-wide regulations set out in the GDPR.
      </p>
      <h2>Divisibility</h2>
      <p>
        If at any time any of the provisions set forth herein are held to be
        inconsistent or invalid under applicable law, such provisions shall be
        deemed void and shall be severed from this document. All other
        provisions will not be affected by law and the rest of the document will
        still be considered valid.
      </p>
      <h2>Amendments</h2>
      <p>
        These terms and conditions may be amended from time to time to maintain
        compliance with the law and to reflect any changes to the way we run our
        site and the way we expect users to behave on our site. We recommend
        that our users check these terms and conditions from time to time to
        ensure that they are aware of any updates. If necessary, we will notify
        users by email of changes to these terms or we will post a notice on our
        site.
      </p>
      <h2>Contact</h2>
      <p>
        Please contact us if you have any questions or concerns. Our contact
        details are as follows:
      </p>
      <p>
        Email : <Link href={`mailto:${contact_mail}`}>{contact_mail}</Link>
      </p>
      <p>Address : {address}</p>
    </article>
  </>
);
export default ToS;
