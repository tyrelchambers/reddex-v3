import {
  faFacebook,
  faInstagram,
  faPatreon,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Image, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FormEvent, useEffect, useRef } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems } from "~/routes";
import { GeneralSettings } from "~/types";
import { api } from "~/utils/api";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FileUpload from "~/components/FileUpload";
import StatusBanner from "~/components/StatusBanner";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageResize
);

const General = () => {
  const apiContext = api.useContext();
  const websiteSave = api.website.saveGeneral.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
    },
  });
  const hideWebsite = api.website.setVisibility.useMutation({
    onSuccess: () => {
      apiContext.website.visibility.invalidate();
    },
  });

  const removeImage = api.website.removeImage.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
    },
  });
  const websiteSettings = api.website.settings.useQuery();
  const websiteVisibility = api.website.visibility.useQuery();
  const thumbnailRef = useRef<FilePond | null>(null);
  const bannerRef = useRef<FilePond | null>(null);

  const form = useForm<GeneralSettings>({
    initialValues: {
      subdomain: "",
      name: "",
      description: "",
      twitter: "",
      facebook: "",
      instagram: "",
      patreon: "",
      podcast: "",
      youtube: "",
    },

    clearInputErrorOnChange: true,
    validate: {
      subdomain: isNotEmpty(),
      name: isNotEmpty(),
    },
  });
  const subdomainQuery = api.website.checkAvailableSubdomain.useQuery(
    form.values.subdomain as string,
    {
      enabled: !!form.values.subdomain,
    }
  );

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({ ...websiteSettings.data });
    }
  }, [websiteSettings.data]);

  const subdomainAvailable =
    !subdomainQuery.data &&
    (!form.values.subdomain ||
      form.values.subdomain !== websiteSettings.data?.subdomain) &&
    form.values.subdomain !== "";

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const thumbnail = thumbnailRef.current?.getFile();
    const banner = bannerRef.current?.getFile();
    const payload: {
      thumbnail?: string;
      banner?: string;
    } = {};
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    if (thumbnail) {
      const url = await thumbnailRef.current?.processFile();
      if (url?.serverId) {
        payload["thumbnail"] = url.serverId;
      }
    }

    if (banner) {
      const url = await bannerRef.current?.processFile();
      if (url?.serverId) {
        payload["banner"] = url.serverId;
      }
    }

    websiteSave.mutate({
      ...form.values,
      ...payload,
    });
  };

  // handler to hide the website from public
  const hideWebsiteHandler = () => {
    hideWebsite.mutate(true);
  };

  const showWebsiteHandler = () => {
    hideWebsite.mutate(false);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className="my-6 flex max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website settings..."
        >
          <h1 className="h1 text-2xl">General</h1>
          {websiteVisibility.data?.hidden ? (
            <StatusBanner
              title="Enable Website"
              subtitle="Enable your website to be seen by the public."
              action={
                <button
                  className="button secondary"
                  onClick={showWebsiteHandler}
                >
                  Make website public{" "}
                </button>
              }
            />
          ) : (
            <StatusBanner
              type="secondary"
              title="Hide Website"
              subtitle="Hide your website so others can't see it."
              action={
                <button
                  className="button secondary"
                  onClick={showWebsiteHandler}
                >
                  Hide
                </button>
              }
            />
          )}
          <form className="form my-10" onSubmit={submitHandler}>
            <div className="flex w-full flex-col">
              <p className="label">Subdomain</p>
              <div className="flex h-fit items-center rounded-lg bg-gray-100 p-1">
                <span className="px-3 text-gray-500">http://</span>
                <TextInput
                  variant="filled"
                  placeholder="subdomain"
                  className="flex-1 rounded-none"
                  classNames={{
                    input: "bg-gray-100 border-0",
                  }}
                  {...form.getInputProps("subdomain")}
                />
                <span className="px-3 text-gray-500">.reddex.app</span>
              </div>
              {subdomainAvailable && (
                <span className="mt-2 flex items-center gap-2 text-sm text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} /> Subdomain is
                  available
                </span>
              )}
            </div>

            <TextInput
              variant="filled"
              label="Site name"
              placeholder="Name of your site"
              {...form.getInputProps("name")}
            />
            <Textarea
              variant="filled"
              label="Site description"
              description="Let people know who you are"
              minRows={8}
              {...form.getInputProps("description")}
            />

            <div className="flex flex-col">
              <p className="label">Thumbnail</p>
              <p className="sublabel">Optimal image size 200 x 200</p>
              {!websiteSettings.data?.thumbnail ? (
                <FileUpload uploadRef={thumbnailRef} type="thumbnail" />
              ) : (
                <div className="flex flex-col">
                  <div className="h-[200px] w-[200px] overflow-hidden rounded-xl">
                    <Image
                      src={websiteSettings.data.thumbnail}
                      alt=""
                      w={200}
                      h={200}
                    />
                  </div>
                  <button
                    className="button alt mt-2"
                    onClick={() =>
                      websiteSettings.data?.thumbnail &&
                      removeImage.mutate({
                        type: "thumbnail",
                        url: websiteSettings.data?.thumbnail,
                      })
                    }
                  >
                    Remove thumbnail
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p className="label">Cover image</p>
              <p className="sublabel">Optimal image size 1500 x 500</p>
              {!websiteSettings.data?.banner ? (
                <FileUpload uploadRef={bannerRef} type="banner" />
              ) : (
                <div className="flex flex-col">
                  <div className="overflow-hidden rounded-xl">
                    <Image src={websiteSettings.data.banner} alt="" />
                  </div>
                  <button
                    className="button alt mt-2"
                    onClick={() =>
                      websiteSettings.data?.banner &&
                      removeImage.mutate({
                        type: "banner",
                        url: websiteSettings.data?.banner,
                      })
                    }
                  >
                    Remove banner
                  </button>
                </div>
              )}
            </div>
            <Divider className="my-4" />

            <section className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-700">Social media</h2>
              <p className="font-thin text-gray-600">
                The links below will appear as social icons on your site. These
                are not required, and the icons will not appear on your site if
                you leave them blank.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <TextInput
                  variant="filled"
                  placeholder="Twitter"
                  icon={<FontAwesomeIcon icon={faTwitter} />}
                  {...form.getInputProps("twitter")}
                />
                <TextInput
                  variant="filled"
                  placeholder="Facebook"
                  icon={<FontAwesomeIcon icon={faFacebook} />}
                  {...form.getInputProps("facebook")}
                />
                <TextInput
                  variant="filled"
                  placeholder="Instagram"
                  icon={<FontAwesomeIcon icon={faInstagram} />}
                  {...form.getInputProps("instagram")}
                />
                <TextInput
                  variant="filled"
                  placeholder="Patreon"
                  icon={<FontAwesomeIcon icon={faPatreon} />}
                  {...form.getInputProps("patreon")}
                />
                <TextInput
                  variant="filled"
                  placeholder="Youtube"
                  icon={<FontAwesomeIcon icon={faYoutube} />}
                  {...form.getInputProps("youtube")}
                />
                <TextInput
                  variant="filled"
                  placeholder="Podcast"
                  icon={<FontAwesomeIcon icon={faPodcast} />}
                  {...form.getInputProps("podcast")}
                />
              </div>
            </section>
            <Divider className="my-4" />

            <button type="submit" className="button main">
              Save changes
            </button>
          </form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default General;
