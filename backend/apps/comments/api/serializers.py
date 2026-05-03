from rest_framework import serializers


class CommentListSerializer(serializers.Serializer):
    since_comment_id = serializers.UUIDField(required=False)


class CreateCommentSerializer(serializers.Serializer):
    content = serializers.CharField(allow_blank=False, trim_whitespace=True)
